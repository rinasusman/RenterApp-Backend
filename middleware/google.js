
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


export default passport.use(
    new GoogleStrategy(
        {
            clientID: '231405930679-09nalurjco0u60eonkkd3fook8cfaf2t.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // Handle Google authentication and user creation in your database
            // For simplicity, I'll assume you already have a User model defined

            // Example User.findOneAndUpdate
            User.findOneAndUpdate(
                { email: profile.emails[0].value },
                {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    // Additional fields as needed
                },
                { upsert: true, new: true },
                (err, user) => {
                    return done(err, user);
                }
            );
        }
    )
);




