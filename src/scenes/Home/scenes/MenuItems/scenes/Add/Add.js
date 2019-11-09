import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { ImageUploader } from 'components';

// Import Actions
import { addItem } from 'services/item/itemActions';
import { getMenus } from 'services/menu/menuActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

// Import settings
import settings from 'config/settings';

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      order: 1,
      price: 0,
      menu_id: this.props.menu.menus ? this.props.menu.menus.data[0].id : ''
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
  }

  componentDidMount() {
    this.props.menuActions.getMenus();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.item.error !== prevProps.item.error &&
      this.props.item.error !== null
    ) {
      let msg = errorMsg(this.props.item.error);
      toastr.error(msg.title, msg.message);
    }

    if (
      this.props.menu.error !== prevProps.menu.error &&
      this.props.menu.error !== null
    ) {
      let msg = errorMsg(this.props.menu.error);
      toastr.error(msg.title, msg.message);
    }

    if (
      this.props.item.success !== prevProps.item.success &&
      this.props.item.success === true
    ) {
      toastr.success('Success', this.props.item.message);
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleOnLoad(file, file_type, file_name) {
    this.setState({
      file,
      file_type,
      file_name
    });
  }

  handleSubmit() {
    if (this.state.name === '') {
      toastr.error('Error', 'Category name can not be an empty value');
      return;
    }

    const item = {
      name: this.state.name,
      price: parseFloat(this.state.price) * settings.INTEGER_PRECISION,
      menu_id: this.state.menu_id,
      file: this.state.file,
      order: this.state.order,
      file_type: this.state.file_type,
      file_name: this.state.file_name
    };

    this.props.itemActions.addItem(item);
  }

  renderMenuOptions(menus) {
    if (menus !== null) {
      return menus.data.map((menu, index) => (
        <option value={menu.id} key={index}>
          {menu.name + ` (${menu.restaurant.name})`}
        </option>
      ));
    }
  }

  render() {
    const { loading, message } = this.props;

    const imageUploaderStyle = {
      position: 'relative',
      width: '60%',
      height: 'auto',
      minHeight: '300px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    if (loading) {
      Swal({
        title: 'Please wait...',
        text: message,
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      Swal.close();
    }

    return (
      <div>
        <strong>Item Add</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Item</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Item name here"
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="text"
              name="price"
              id="price"
              placeholder=""
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="menu_id">Menu</Label>
            <Input
              type="select"
              name="menu_id"
              id="menu_id"
              onChange={this.onChange}
            >
              {this.renderMenuOptions(this.props.menu.menus)}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="order">Order</Label>
            <Input
              type="text"
              name="order"
              id="order"
              defaultValue={1}
              placeholder="Order"
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Image</Label>
            <ImageUploader
              style={imageUploaderStyle}
              handleOnLoad={this.handleOnLoad}
            />
          </FormGroup>
          <Button
            color="primary"
            onClick={this.handleSubmit}
            className="float-right"
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    item: {
      ...state.default.services.item
    },
    menu: {
      ...state.default.services.menu
    }
  }),
  dispatch => ({
    itemActions: bindActionCreators({ addItem }, dispatch),
    menuActions: bindActionCreators({ getMenus }, dispatch)
  })
)(Add);
