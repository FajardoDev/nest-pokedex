import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.onterface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model, Promise } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  // #1 SEED Crear Pokémon en base de datos mediante la injección de dependencias
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    // Evitar que cuando ejecute el SEED me choque los mismos name
    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // Insertar multiples registros simultáneamente // const insertPromiseArray = [];
    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.map(async ({ name, url }) => {
      const segments = url.split('/');

      const no = +segments[segments.length - 2];

      // const pokemon = await this.pokemonModel.create({ name, no }); // #4 SEED
      // insertPromiseArray.push(this.pokemonModel.create({ name, no }));
      pokemonToInsert.push({ name, no });

      // console.log({ name, no });
    });
    // await Promise.all(insertPromiseArray)
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'SEED Executed';
  }
}

/*
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  async executeSeed() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=650';
    const resp = await fetch(url);
    const data = await resp.json();
    console.log(data);

   
    return data;
  }
}


* */
