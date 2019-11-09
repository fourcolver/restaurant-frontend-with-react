import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Label,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Form,
  Input,
  Button
} from 'reactstrap';
import { ImageUploader } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { updateMenu } from 'services/menu/menuActions';
import queryString from 'query-string';

class MenuEditModal extends React.Component {
  constructor(props) {
    super(props);

    this.update_data = {
      ...props.menu
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.menu !== prevProps.menu) {
      this.update_data = {
        name: this.props.menu.name,
        id: this.props.menu.id,
        restaurant_id: this.props.menu.restaurant.id,
        order: this.props.menu.order
      };
    }
  }

  onChange(e) {
    this.update_data = {
      ...this.update_data,
      [e.target.name]: e.target.value
    };
  }

  renderRestaurantOptions(restaurants) {
    if (restaurants) {
      return restaurants.map((restaurant, index) => (
        <option key={index} value={restaurant.id} onChange={this.onChange}>
          {restaurant.name}
        </option>
      ));
    }
  }

  render() {
    const { modal, toggle, restaurants } = this.props;
    const { name, restaurant, order } = this.props.menu;
    return (
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}> Menu Edit </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="name"> Name </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Menu name here"
                  defaultValue={name}
                  onChange={this.onChange}
                />
              </FormGroup>
            </Form>
            <FormGroup>
              <Label for="restaurant">Restaurant</Label>
              <Input
                type="select"
                name="restaurant_id"
                id="restaurant_id"
                defaultValue={restaurant ? restaurant.id : ''}
                onChange={this.onChange}
              >
                {this.renderRestaurantOptions(restaurants)}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="order">Order</Label>
              <Input
                type="text"
                name="order"
                id="order"
                defaultValue={order}
                onChange={this.onChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.update_data = {
                  ...this.update_data
                };
                const params = queryString.parse(this.props.location.search);

                this.props.menuActions.updateMenu(
                  this.update_data.id,
                  this.update_data,
                  params
                );
                toggle();
              }}
            >
              Update
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                toggle();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

MenuEditModal.propTypes = {
  toggle: PropTypes.func,
  modal: PropTypes.bool,
  menu: PropTypes.object
};

MenuEditModal = withRouter(MenuEditModal);

export default connect(
  null,
  dispatch => ({
    menuActions: bindActionCreators({ updateMenu }, dispatch)
  })
)(MenuEditModal);
