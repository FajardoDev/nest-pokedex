import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  // Crear Pokémon en base de datos mediante la injección de dependencias
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    // return 'Esta acción añade un nuevo pokemon.';
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

      // const newPokemon = new this.pokemonModel(createPokemonDto)
      // return newPokemon.save()
    } catch (error) {
      // console.log(error);
      this.handleExceptionsError(error);
    }
  }
  // .skip(3) se salta los primeros 3 // ordenarlo ascendente .sort({no: 1} delete columna .select('-__v')
  findAll(paginationDto: PaginationDto) {
    const { limit = 20, offset = 0 } = paginationDto;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    //! return `This action returns a #${id} pokemon`; Buscar Pokemon por nombre, MongoId y no

    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      // !isNaN(+id) si esto es # Aquí estamos buscando un pokemon por el 1,2,3 etc...
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // Buscar por MongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //  Buscar por Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotAcceptableException(
        `El pokemon con el id, nombre o número '${term}' no encontrado`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    // return `This action updates a #${id} pokemon` update Pokemon en base de dato x cualquier termino de search

    const pokemon = await this.findOne(term); // findOne reutilizado con sus respectivas validaciones
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      // Grabar en la db
      await pokemon.updateOne(updatePokemonDto); // updatePokemonDto la data que quiero actualizar
      return { ...pokemon.toJSON(), ...updatePokemonDto }; // esparso la propiedades que tiene y la sobre escribo
    } catch (error) {
      console.log(error);
      this.handleExceptionsError(error);
    }
  }

  // return `This action removes a #${id} pokemon`;
  async remove(id: string) {
    // const pokemon = await this.findOne(id); //  findOne Saber si el id existe ya validamos arriba
    // await pokemon.deleteOne();
    // return { id };
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon con el id "${id}" no existe`);
    }

    // return result;
    return;
  }

  // Para los errores
  handleExceptionsError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `El Pokemon ya existe en la base de datos ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `No puedo crear Pokémon: verifique los registros del servidor`,
    );
  }
}

// Web Scraping : Traer todos los datos de una página y tranformarla en JSON
