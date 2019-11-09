import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
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
import settings from 'config/settings';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { updateRestaurant } from 'services/restaurant/restaurantActions';
import queryString from 'query-string';

// Import Actions
import { getCategories } from 'services/category/categoryActions';
import { updateRestaurant } from 'services/restaurant/restaurantActions';

const imageUploaderStyle = {
  position: 'relative',
  marginTop: '1.0rem',
  width: '60%',
  height: 'auto',
  minHeight: '300px',
  borderWidth: '2px',
  borderColor: 'rgb(102, 102, 102)',
  borderStyle: 'dashed',
  borderRadius: '5px'
};

class RestaurantEditModal extends React.Component {
  constructor(props) {
    super(props);

    this.update_data = {
      ...props.menu
    };

    this.state = {
      file: null,
      file_type: '',
      file_name: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.restaurant !== prevProps.restaurant) {
      this.update_data = {
        name: this.props.restaurant.name,
        id: this.props.restaurant.id,
        categories: this.props.restaurant.categories,
        order: this.props.restaurant.order
      };
    }
  }

  onChange(e) {
    this.update_data = {
      ...this.update_data,
      [e.target.name]: e.target.value
    };
  }

  onLoad(file, file_type, file_name) {
    this.setState({
      file,
      file_type,
      file_name
    });
  }

  onCategoryChange(options) {
    const categories = options.map(item => {
      return {
        id: item.value,
        name: item.label
      };
    });

    this.update_data = {
      ...this.update_data,
      categories
    };
  }

  renderCategoryOptions(categories) {
    const restaurant = this.props.restaurant;
    if (categories && categories.data) {
      const options = categories.data.map(category => {
        return {
          value: category.id,
          label: `${category.name} (${category.city.name})`
        };
      });
      let optionValue = [];
      if (restaurant && restaurant.categories) {
        optionValue = restaurant.categories.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
      }

      return (
        <Select
          options={options}
          isMulti
          onChange={this.onCategoryChange}
          value={optionValue}
        />
      );
    }
  }

  render() {
    const { modal, toggle, category } = this.props;
    const { name, order, image_url } = this.props.restaurant;
    return (
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}> Restaurant Edit </ModalHeader>
          <ModalBody>
            <Form>
              {/* Restaurant name*/}
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

              {/* Category select form */}
              <Label for="category"> Category </Label>
              {this.renderCategoryOptions(category.categories)}

              {/* Order */}
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
              {/* Restaurant Image */}
              <FormGroup>
                <Label>Image</Label>
                <ImageUploader
                  style={imageUploaderStyle}
                  handleOnLoad={this.onLoad}
                  image={settings.BASE_URL + image_url}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.update_data = {
                  ...this.update_data,
                  file: this.state.file,
                  file_type: this.state.file_type,
                  file_name: this.state.file_name
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
    restaurantActions: bindActionCreators({ updateRestaurant }, dispatch),
    categoryActions: bindActionCreators({ getCategories }, dispatch)
  })
)(RestaurantEditModal);
