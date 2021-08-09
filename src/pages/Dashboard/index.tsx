import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';


type Foods = {
  id: number,
  name: string,
  description: string,
  available: boolean,
  price: number,
}

interface FoodProps {
  id: string;
  food: Foods[];
}

function Dashboard () {
  
  const [food, setFood] = useState([]);
  const [editingFood, setEditingFoods] = useState<FoodProps>({} as any);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function loadFoods() {
    await api.get('/foods').then(response => setFood(response.data));
  }

  useEffect(() => {
    loadFoods();
  }, [])
 

  const handleAddFood = async (food : FoodProps[]) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFood([...food, response.data] as any);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food : any) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = food.map((f: any) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFood([...food, foodsUpdated] as any);
      
    } catch (err) {
      console.log(err);
    } finally {
      loadFoods();
    }
  }

  const handleDeleteFood = async (id:string) => {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = food.filter((food: any) => food.id !== id);
    setFood(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(modalOpen => !modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(editModalOpen => !editModalOpen);
  }

  const handleEditFood = (food:FoodProps) => {
    setEditingFoods(food);
    setEditModalOpen(true);
  }


    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {food &&
            food.map((food: Foods) => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
 
};

export default Dashboard;
