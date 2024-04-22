import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;

  @IsString()
  @MinLength(1, { message: `Debe de tener al menos un caracter` })
  name: string;
}
// Comprueba si el primer número es mayor o igual que el segundo

// no no debe ser inferior a 1",
//"no debe ser un número positivo
// no debe ser un número entero
// Número inesperado en JSON en la posición 14
