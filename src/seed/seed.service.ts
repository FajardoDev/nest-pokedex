import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.onterface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=65',
    );

    // return 'SEED executed';

    data.results.map(({ name, url }) => {
      const segments = url.split('/');

      const no = +segments[segments.length - 2];

      console.log({ name, no });
    });

    return data.results;
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
