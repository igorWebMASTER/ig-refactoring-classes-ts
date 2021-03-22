import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

function Dashboard () {
  
  const [food, setFood] = useState([]);
  const [editingFood, setEditingFoods] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const food = await api.get('/foods').then(response => setFood(response.data));

      return food;
    }

    loadFoods();
  }, [food])
 

  const handleAddFood = async food => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFood([...food, response.data]);
      // this.setState({ foods: [...food, response.data] });
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async food => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = food.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

     setFood([...food, foodsUpdated]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async id => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = food.filter(food => food.id !== id);

    setFood(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(modalOpen => !modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(editModalOpen => !editModalOpen);
  }

  const handleEditFood = food => {
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
            food.map(food => (
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
