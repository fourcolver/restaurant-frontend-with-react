import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-toggle-switch';
import Select from 'react-select';
import { ImageUploader } from 'components';
import settings from 'config/settings';
import ModalWrapper from '../ModalWrapper';

// Import Actions
import { updateRestaurant } from 'services/restaurant/restaurantActions';
import { getCategories } from 'services/category/categoryActions';

class RestaurantEdit extends React.Component {
  constructor(props) {
    super(props);

    this.update_data = {
      ...props.modal.params
    };

    this.state = {
      is_open: props.modal.params.is_open
    };

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  componentDidMount() {
    this.props.categoryActions.getCategories();
  }

  onChange(e) {
    this.update_data = {
      ...this.update_data,
      [e.target.name]: e.target.value
    };
  }

  onLoad(file, file_type, file_name) {
    this.update_data = {
      ...this.update_data,
      file,
      file_type,
      file_name
    };
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
    this.forceUpdate();
  }

  renderCategoryOptions(categories) {
    if (categories && categories.data) {
      const options = categories.data.map(category => {
        return {
          value: category.id,
          label: `${category.name} (${category.city.name})`
        };
      });

      let optionValue = [];
      if (this.update_data.categories) {
        optionValue = this.update_data.categories.map(item => {
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
    const restaurant = this.props.modal.params;

    return (
      <ModalWrapper
        title="Update restaurant"
        okText="Update"
        onOk={() => {
          const params = queryString.parse(this.props.location.search);

          const category = this.update_data.categories.map(item => {
            return item.id;
          });

          this.update_data = {
            ...this.update_data,
            is_open: this.state.is_open,
            category
          };

          this.props.restaurantActions.updateRestaurant(
            this.update_data.id,
            this.update_data,
            params
          );
        }}
      >
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Restaurant name here"
              onChange={this.onChange}
              defaultValue={restaurant.name}
            />
          </FormGroup>
          <Label for="category">Category</Label>

          {/* Category Select form*/}
          {this.renderCategoryOptions(this.props.category.categories)}

          {/* Order */}
          <FormGroup>
            <Label for="order">Order</Label>
            <Input
              type="text"
              name="order"
              id="order"
              placeholder="Order"
              onChange={this.onChange}
              defaultValue={restaurant.order}
            />
          </FormGroup>

          <FormGroup>
            <Label for="is_open">Open/Closed</Label>
            <div>
              <Switch
                id="is_open"
                onClick={() => {
                  this.setState({ is_open: ~~!this.state.is_open });
                }}
                on={!!this.state.is_open}
              />
            </div>
          </FormGroup>

          {/* Image Upload form*/}
          <ImageUploader
            style={{
              position: 'relative',
              width: '100%',
              height: 'auto',
              minHeight: '300px',
              borderWidth: '2px',
              borderColor: 'rgb(102, 102, 102)',
              borderStyle: 'dashed',
              borderRadius: '5px'
            }}
            handleOnLoad={this.onLoad}
            image={settings.BASE_URL + this.props.modal.params.image_url}
          />
        </Form>
      </ModalWrapper>
    );
  }
}

RestaurantEdit = withRouter(RestaurantEdit);

export default connect(
  state => ({
    category: state.default.services.category
  }),
  dispatch => ({
    categoryActions: bindActionCreators({ getCategories }, dispatch),
    restaurantActions: bindActionCreators({ updateRestaurant }, dispatch)
  })
)(RestaurantEdit);
