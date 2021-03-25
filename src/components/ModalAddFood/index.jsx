import { createRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

// interface ModalAddFoodProps{
//   data: () => void;
// }

// interface ModalAddFoodPropsData{
//   setIsOpen: () => void;
//   isOpen: boolean;
//   handleAddFood:Function;
// }

function ModalAddFood(props ) {
  const formRef = createRef();
  const setIsOpenProp = props.setIsOpen;
  const isOpenProp = props.isOpen;

  const handleSubmit  = async (data) => {

    props.handleAddFood(data);
    setIsOpenProp();
  };



    return (
      <Modal isOpen={isOpenProp} setIsOpen={setIsOpenProp}>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Novo Prato</h1>
          <Input name="image" placeholder="Cole o link aqui" />

          <Input name="name" placeholder="Ex: Moda Italiana" />
          <Input name="price" placeholder="Ex: 19.90" />

          <Input name="description" placeholder="Descrição" />
          <button type="submit" data-testid="add-food-button">
            <p className="text">Adicionar Prato</p>
            <div className="icon">
              <FiCheckSquare size={24} />
            </div>
          </button>
        </Form>
      </Modal>
    );
  
};

export default ModalAddFood;
