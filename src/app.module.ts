import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi-schema.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration], // Aquí aprece nuestra variables de entornos
      validationSchema: JoiValidationSchema,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Configurations: DB MONGO
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokemondb',
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {
  constructor() {
    // console.log(process.env);
  }
}
