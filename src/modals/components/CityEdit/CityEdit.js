import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-toggle-switch';
import { ImageUploader } from 'components';
import settings from 'config/settings';

import ModalWrapper from '../ModalWrapper';

// Import Actions
import { updateCity } from 'services/city/cityActions';

class CityEdit extends React.Component {
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

  render() {
    const city = this.props.modal.params;

    return (
      <ModalWrapper
        title="Update city"
        onOk={() => {
          const params = queryString.parse(this.props.location.search);
          this.update_data = {
            ...this.update_data,
            is_open: this.state.is_open
          };

          this.props.cityActions.updateCity(
            this.update_data.id,
            this.update_data,
            params
          );
        }}
        okText="Update"
      >
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="City name here"
              defaultValue={city.name}
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="order">Order</Label>
            <Input
              type="text"
              name="order"
              id="order"
              defaultValue={city.order}
              onChange={this.onChange}
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
              image={settings.BASE_URL + this.props.modal.params.image_url}
            />
          </FormGroup>
        </Form>
      </ModalWrapper>
    );
  }
}

CityEdit = withRouter(CityEdit);

export default connect(
  state => ({
    ...state.default.services.city
  }),
  dispatch => ({
    cityActions: bindActionCreators({ updateCity }, dispatch)
  })
)(CityEdit);
