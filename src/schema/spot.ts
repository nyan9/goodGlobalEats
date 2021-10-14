import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import { Context, AuthorizedContext } from "./context";

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(-180)
  @Max(180)
  @Field((_type) => Float)
  longitude!: number;
}

@InputType()
class SpotInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => String)
  appetizer!: string;

  @Field((_type) => String)
  entree!: string;

  @Field((_type) => String)
  drink!: string;
}

@ObjectType()
class Spot {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => String)
  publicId(): string {
    // cloudinary Image component only need the publicId from the full image string
    const parts = this.image.split("/");
    return parts[-1];
  }

  @Field((_type) => String)
  appetizer!: string;

  @Field((_type) => String)
  entree!: string;

  @Field((_type) => String)
  drink!: string;
}

@Resolver()
export class SpotResolver {
  @Authorized()
  @Mutation((_returns) => Spot, { nullable: true })
  async createSpot(
    @Arg("input") input: SpotInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    return await ctx.prisma.spot.create({
      data: {
        userId: ctx.uid,
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        appetizer: input.appetizer,
        entree: input.entree,
        drink: input.drink,
      },
    });
  }
}
