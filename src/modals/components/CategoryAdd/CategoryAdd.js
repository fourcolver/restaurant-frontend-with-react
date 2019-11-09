import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-toggle-switch';
import { ImageUploader } from 'components';
import ModalWrapper from '../ModalWrapper';
import { addCategory } from 'services/category/categoryActions';
import { getCities } from 'services/city/cityActions';

class CategoryAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = { is_open: 1 };
    this.submit_data = { order: 1 };

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.renderCityOptions = this.renderCityOptions.bind(this);
  }

  componentDidMount() {
    this.props.cityActions.getCities();
  }

  componentDidUpdate(prevProps) {
    if (this.props.city !== prevProps.city) {
      if (
        this.props.city &&
        this.props.city.cities &&
        this.props.city.cities.data
      ) {
        this.submit_data = {
          ...this.submit_data,
          city_id: this.props.city.cities.data[0].id
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
    return (
      <ModalWrapper
        title="Add category"
        okText="Submit"
        onOk={() => {
          const params = queryString.parse(this.props.location.search);
          this.submit_data = {
            ...this.submit_data,
            is_open: this.state.is_open
          };

          this.props.categoryActions.addCategory(this.submit_data, params);
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
              defaultValue={1}
              onChange={this.onChange}
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
            />
          </FormGroup>
        </Form>
      </ModalWrapper>
    );
  }
}

CategoryAdd = withRouter(CategoryAdd);

export default connect(
  state => ({
    city: {
      ...state.default.services.city
    }
  }),
  dispatch => ({
    cityActions: bindActionCreators({ getCities }, dispatch),
    categoryActions: bindActionCreators({ addCategory }, dispatch)
  })
)(CategoryAdd);
