import MainLayout from "@/components/layout/main";
import PokemonService from "@/modules/pokemon/service";
import { GetServerSideProps } from "next";
import { PokemonList } from "@/modules/pokemon/types";
import ListPokemon from "@/modules/pokemon/components/ListPokemon";
import { useDispatch, useSelector } from "react-redux";
import InfoPokemon from "@/modules/pokemon/components/InfoPokemon";
import { removePokemon, setPokemon } from "@/modules/pokemon/store";

type Props = {
  data: PokemonList;
}

export default function Home({data}: Props) {
  const pokemon = useSelector((state: any) => state.pokemon.pokemonDetail);
  const list = useSelector((state: any) => state.pokemon.pokemonList);
  const service = new PokemonService();
  const dispatch = useDispatch();

  const hasPokemon = pokemon && pokemon.name !== undefined;
  const hasList = list && list.results > 0;

  async function handleSearch(name: string) {
    try{
      const pokemon = await service.getDetails(name);
      dispatch(setPokemon(pokemon));
    }catch(e) {
      dispatch(removePokemon());
    }
  }

  if (hasPokemon) return (
    <MainLayout>
      <InfoPokemon pokemon={pokemon}  />
    </MainLayout>
  );

  return (
    <MainLayout>
      <h1>Pokemon List</h1>
      <ListPokemon data={hasList ? list : data} onSearch={handleSearch} />
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const service = new PokemonService();
  const data: PokemonList | null = await service.get(1);

  return {
    props: {
      data
    }
  };
};