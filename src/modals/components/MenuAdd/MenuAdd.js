import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import ModalWrapper from '../ModalWrapper';
import { addMenu } from 'services/menu/menuActions';
import { getRestaurants } from 'services/restaurant/restaurantActions';
import { getCategories } from 'services/category/categoryActions';

class MenuAdd extends React.Component {
  constructor(props) {
    super(props);

    this.submit_data = { order: 1 };

    this.onChange = this.onChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.renderRestaurantOptions = this.renderRestaurantOptions.bind(this);
  }

  componentDidMount() {
    this.props.categoryActions.getCategories();
    this.props.restaurantActions.getRestaurants();
  }

  componentDidUpdate(prevProps) {
    if (this.props.restaurant !== prevProps.restaurant) {
      if (
        this.props.restaurant &&
        this.props.restaurant.restaurants &&
        this.props.restaurant.restaurants.data
      ) {
        this.submit_data = {
          ...this.submit_data,
          restaurant_id: this.props.restaurant.restaurants.data[0]
            ? this.props.restaurant.restaurants.data[0].id
            : null
        };
      }
    }
  }

  onChange(e) {
    this.submit_data = {
      ...this.submit_data,
      [e.target.name]: e.target.value
    };
  }

  onLoad(file, file_type, file_name) {
    this.submit_data = {
      ...this.submit_data,
      file,
      file_type,
      file_name
    };
  }

  onCategoryChange(e) {
    /* eslint-disable-next-line */
    if (e.target.value != -1) {
      this.props.restaurantActions.getRestaurants({
        category: e.target.value
      });
    } else {
      this.props.restaurantActions.getRestaurants();
    }
  }

  renderRestaurantOptions(restaurants) {
    if (restaurants !== null) {
      return restaurants.data.map((restaurant, index) => (
        <option value={restaurant.id} key={index}>
          {restaurant.name}
        </option>
      ));
    }
  }

  renderCategoryOptions(categories) {
    if (categories !== null) {
      return categories.data.map((category, index) => (
        <option value={category.id} key={index}>
          {category.name}
        </option>
      ));
    }
  }

  render() {
    return (
      <ModalWrapper
        title="Add category"
        okText="Submit"
        onOk={() => {
          const params = queryString.parse(this.props.location.search);

          this.props.menuActions.addMenu(this.submit_data, params);
        }}
      >
        <Form className="mt-3">
          {/* Category name */}
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Menu name here"
              onChange={this.onChange}
            />
          </FormGroup>

          {/* categirt */}
          <FormGroup>
            <Label for="category_id">Category</Label>
            <Input
              type="select"
              name="category_id"
              id="category_id"
              onChange={this.onCategoryChange}
            >
              <option value="-1"> No select </option>
              {this.renderCategoryOptions(this.props.category.categories)}
            </Input>
          </FormGroup>

          {/* Restaurants */}
          <FormGroup>
            <Label for="restaurant_id">Restaurant</Label>
            <Input
              type="select"
              name="restaurant_id"
              id="restaurant_id"
              onChange={this.onChange}
            >
              {this.renderRestaurantOptions(this.props.restaurant.restaurants)}
            </Input>
          </FormGroup>

          {/* Category order */}
          <FormGroup>
            <Label for="order">Order</Label>
            <Input
              type="text"
              name="order"
              id="order"
              placeholder="Order"
              defaultValue={1}
              onChange={this.onChange}
            />
          </FormGroup>
        </Form>
      </ModalWrapper>
    );
  }
}

MenuAdd = withRouter(MenuAdd);

export default connect(
  state => ({
    restaurant: {
      ...state.default.services.restaurant
    },
    category: {
      ...state.default.services.category
    }
  }),
  dispatch => ({
    categoryActions: bindActionCreators({ getCategories }, dispatch),
    restaurantActions: bindActionCreators({ getRestaurants }, dispatch),
    menuActions: bindActionCreators({ addMenu }, dispatch)
  })
)(MenuAdd);
