import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-toggle-switch';
import { ImageUploader } from 'components';
import ModalWrapper from '../ModalWrapper';
import { updateCategory } from 'services/category/categoryActions';
import { getCities } from 'services/city/cityActions';
import settings from 'config/settings';

class CategoryEdit extends React.Component {
  constructor(props) {
    super(props);

    this.update_data = {
      ...props.modal.params,
      city_id: props.modal.params.city.id
    };

    this.state = {
      is_open: props.modal.params.is_open
    };

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.renderCityOptions = this.renderCityOptions.bind(this);
  }

  componentDidMount() {
    this.props.cityActions.getCities();
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

  renderCityOptions(cities) {
    if (cities !== null) {
      return cities.data.map((city, index) => (
        <option value={city.id} key={index}>
          {city.name}
        </option>
      ));
    }
  }

  render() {
    const category = this.props.modal.params;

    return (
      <ModalWrapper
        title="Update category"
        okText="Update"
        onOk={() => {
          const params = queryString.parse(this.props.location.search);
          this.update_data = {
            ...this.update_data,
            is_open: this.state.is_open
          };

          this.props.categoryActions.updateCategory(
            this.update_data.id,
            this.update_data,
            params
          );
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
              placeholder="Category name here"
              onChange={this.onChange}
              defaultValue={category.name}
            />
          </FormGroup>

          {/* Category city */}
          <FormGroup>
            <Label for="city">City</Label>
            <Input
              type="select"
              name="city_id"
              id="city_id"
              onChange={this.onChange}
              defaultValue={category.city.id}
            >
              {this.renderCityOptions(this.props.city.cities)}
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
              onChange={this.onChange}
              defaultValue={category.order}
            />
          </FormGroup>

          {/* Category switch on/off */}
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

          {/* Category image */}
          <FormGroup>
            <Label>Image</Label>
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
              image={settings.BASE_URL + category.image_url}
            />
          </FormGroup>
        </Form>
      </ModalWrapper>
    );
  }
}
CategoryEdit = withRouter(CategoryEdit);

export default connect(
  state => ({
    city: {
      ...state.default.services.city
    }
  }),
  dispatch => ({
    cityActions: bindActionCreators({ getCities }, dispatch),
    categoryActions: bindActionCreators({ updateCategory }, dispatch)
  })
)(CategoryEdit);
