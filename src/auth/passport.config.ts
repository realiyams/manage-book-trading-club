/* eslint-disable prettier/prettier */
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class PassportConfig {
  constructor(private readonly authService: AuthService) { }

  public configure(passport: PassportStatic) {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const user = await this.authService.validateUser(username, password);
          if (!user) {
            return done(null, false, {
              message: 'Incorrect username or password',
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }),
    );

    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: 'supersecretjwt',
        },
        async (jwtPayload, done) => {
          try {
            const user = await this.authService.findById(jwtPayload.userId);
            if (!user) {
              return done(null, false);
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        },
      ),
    );

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const user = await this.authService.findById(id);
        if (!user) {
          return done(new Error('User not found'));
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    });
  }
}

