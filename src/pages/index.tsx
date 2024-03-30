import MainLayout from "@/components/layout/main";
import PokemonService from "@/modules/pokemon/service";
import { useDispatch, useSelector } from "react-redux";
import { removePokemon, setPokemon, setList } from "@/modules/pokemon/store";
import { useEffect } from "react";
import ListPokemon from "@/modules/pokemon/components/ListPokemon";
import InfoPokemon from "@/modules/pokemon/components/InfoPokemon";
import { Modal } from 'antd/lib';

export default function Home() {
  const pokemon = useSelector((state: any) => state.pokemon.pokemonDetail);
  const list = useSelector((state: any) => state.pokemon.pokemonList);
  const service = new PokemonService();
  const dispatch = useDispatch();

  const hasPokemon = pokemon && pokemon.name !== undefined;

  useEffect(() => {
    handleSearchList(1);
  }, []);

  async function handleSearch(name: string) {
    try{
      const pokemon = await service.getDetails(name);
      dispatch(setPokemon(pokemon));
    }catch(e) {
      dispatch(removePokemon());
    }
  }

  async function handleSearchList(numberPage: number, pageSize?: number) {
    try{
      const list = await service.get(numberPage, pageSize);
      dispatch(setList(list));
    }catch(e) {
      Modal.error({
        title: 'Error',
        content: 'An error occurred while trying to fetch the data. Try again later.'
      });
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
      <ListPokemon data={list} onSearch={handleSearch} onSearchList={handleSearchList} />

    </MainLayout>
  );
}