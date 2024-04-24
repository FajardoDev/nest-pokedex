import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// @Schema({timestamps: true}) Añade createAt UpdateAt
@Schema()
export class Pokemon extends Document {
  // id: string Mongo me lo da

  @Prop({
    unique: true,
    index: true,
    // trim: true,  Quita los espacios
    // required: true,
    // default: false si fuera boolean
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
