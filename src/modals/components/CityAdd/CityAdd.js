import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-toggle-switch';
import { ImageUploader } from 'components';
import ModalWrapper from '../ModalWrapper';
import { addCity } from 'services/city/cityActions';

class CityAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = { is_open: 1 };

    this.submit_data = { order: 1 };

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
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

  render() {
    return (
      <ModalWrapper
        title="Add city"
        onOk={() => {
          const params = queryString.parse(this.props.location.search);
          this.submit_data = {
            ...this.submit_data,
            is_open: this.state.is_open
          };

          this.props.cityActions.addCity(this.submit_data, params);
        }}
        okText="Submit"
      >
        <Form className="mt-3">
          {/* City name */}
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="City name here"
              onChange={this.onChange}
            />
          </FormGroup>

          {/* City order */}
          <FormGroup>
            <Label for="order">Order</Label>
            <Input
              type="text"
              name="order"
              id="order"
              defaultValue={1}
              onChange={this.onChange}
            />
          </FormGroup>

          {/* City switch on/off */}
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

          {/* City image */}
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

CityAdd = withRouter(CityAdd);

export default connect(
  null,
  dispatch => ({
    cityActions: bindActionCreators({ addCity }, dispatch)
  })
)(CityAdd);
