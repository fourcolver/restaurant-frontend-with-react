import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { ImageUploader } from 'components';

// Import Actions
import {
  updateItem,
  updateCurrentItem,
  getItem
} from 'services/item/itemActions';
import { getMenus } from 'services/menu/menuActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

// Import settings
import settings from 'config/settings';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      file_type: '',
      file_name: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
  }

  componentDidMount() {
    this.props.itemActions.getItem(this.props.match.params.id);
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
    let item = this.props.item.currentItem;

    switch (e.target.name) {
      case 'menu':
        const menus = this.props.menu.menus.data;
        const menu = menus.find(function(element) {
          // eslint-disable-next-line
          return element.id == e.target.value;
        });
        item = {
          ...item,
          menu
        };
        break;
      case 'price':
        item = {
          ...item,
          [e.target.name]: e.target.value * settings.INTEGER_PRECISION
        };
        break;
      default:
        item = {
          ...item,
          [e.target.name]: e.target.value
        };
        break;
    }

    this.props.itemActions.updateCurrentItem(item);
  }

  handleSubmit() {
    if (this.props.item.currentItem) {
      if (this.props.item.currentItem.name === '') {
        toastr.error('Error', 'Category name can not be an empty value');
        return;
      }
    } else {
      toastr.error('Error', 'Something went wrong');
    }

    const item = {
      name: this.props.item.currentItem.name,
      id: this.props.item.currentItem.id,
      menu_id: this.props.item.currentItem.menu.id,
      price: this.props.item.currentItem.price,
      order: this.props.item.currentItem.order,
      file: this.state.file,
      file_type: this.state.file_type,
      file_name: this.state.file_name
    };

    let params = {
      id: this.props.match.params.id,
      item
    };

    this.props.itemActions.updateItem({ ...params });
  }

  handleOnLoad(file, file_type, file_name) {
    this.setState({
      file,
      file_type,
      file_name
    });
  }

  renderMenuOptions(menus) {
    if (menus !== null) {
      return menus.data.map((menu, index) => {
        return (
          <option key={index} value={menu.id}>
            {menu.name}
          </option>
        );
      });
    }
  }

  render() {
    const { loading, message } = this.props.item;

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
        <strong>Item Update</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Item Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Item name here"
              onChange={this.onChange}
              value={
                this.props.item.currentItem
                  ? this.props.item.currentItem.name
                  : ''
              }
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
              value={
                this.props.item.currentItem
                  ? this.props.item.currentItem.price /
                    settings.INTEGER_PRECISION
                  : '0'
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="menu">Menu</Label>
            <Input
              type="select"
              name="menu"
              id="menu"
              value={
                this.props.item.currentItem
                  ? this.props.item.currentItem.menu.id
                  : ''
              }
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
              placeholder="Order"
              onChange={this.onChange}
              value={
                this.props.item.currentItem
                  ? this.props.item.currentItem.order
                  : ''
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>Image</Label>
            <ImageUploader
              style={imageUploaderStyle}
              handleOnLoad={this.handleOnLoad}
              image={
                this.props.item.currentItem
                  ? settings.BASE_URL + this.props.item.currentItem.image_url
                  : ''
              }
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
    itemActions: bindActionCreators(
      { updateItem, updateCurrentItem, getItem },
      dispatch
    ),
    menuActions: bindActionCreators({ getMenus }, dispatch)
  })
)(Edit);
