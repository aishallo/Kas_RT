const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Cek apakah warga ini sudah pernah login sebelumnya
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // Jika sudah ada, perbarui waktu login terakhirnya
            user.tanggalLoginTerakhir = Date.now();
            await user.save();
            return done(null, user);
          } else {
            // 2. Jika belum ada, buat data warga baru di database MongoDB
            const newUser = {
              googleId: profile.id,
              nama: profile.displayName,
              email: profile.emails[0].value,
              fotoProfil: profile.photos[0].value,
              tanggalLoginTerakhir: Date.now(),
            };
            user = await User.create(newUser);
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      },
    ),
  );

  // Menyimpan data user ke dalam session (cookie)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Mengambil data user dari session (cookie)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
