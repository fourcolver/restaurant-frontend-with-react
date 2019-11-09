import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button, UncontrolledCollapse, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

// Import components
import ImageUploader from './../ImageUploader';
import MenuEditModal from './../MenuEditModal';

// Import Actions
import { deleteMenu } from 'services/menu/menuActions';
import {
  addItem,
  deleteItem,
  addItems,
  updateItem
} from 'services/item/itemActions';
import { getRestaurants } from 'services/restaurant/restaurantActions';

// Import Settings
import settings from 'config/settings';
import queryString from 'query-string';

const imageUploaderStyle = {
  position: 'relative',
  height: '50px',
  minHeight: '50px',
  maxHeight: '50px',
  borderWidth: '2px',
  borderColor: 'rgb(102, 102, 102)',
  borderStyle: 'dashed',
  borderRadius: '5px'
};

class MenuTable extends React.Component {
  constructor(props) {
    super(props);
    this.submitData = []; // menu item submit data
    this.editData = []; // menu item edit data
    this.modal_data = {}; // Modal dialog data

    this.state = {
      modal: false // modal dialog flag
    };

    this.renderMenuTable = this.renderMenuTable.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.handleOnLoadForEdit = this.handleOnLoadForEdit.bind(this);
    this.handleEditMenuItem = this.handleEditMenuItem.bind(this);
    this.handleDeleteMenuItem = this.handleDeleteMenuItem.bind(this);
    this.renderSubmitItems = this.renderSubmitItems.bind(this);
    this.addMenuItemInput = this.addMenuItemInput.bind(this);
    this.handleUpdateMenuItem = this.handleUpdateMenuItem.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.restaurantActions.getRestaurants();
  }

  /**
   * Toggle modal dialog
   */
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleEdit(id) {
    this.props.history.push(`/menus/${id}/edit`);
  }

  handleDelete(id) {
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.props.menuActions.deleteMenu(id);
      }
    });
  }

  handleOnLoad(file, file_type, file_name, menuId, inputItemIndex) {
    this.submitData[menuId][inputItemIndex] = {
      ...this.submitData[menuId][inputItemIndex],
      file,
      file_name,
      file_type
    };
  }

  handleOnLoadForEdit(file, file_type, file_name, menuId, inputItemIndex) {
    this.editData[menuId][inputItemIndex] = {
      ...this.editData[menuId][inputItemIndex],
      file,
      file_name,
      file_type
    };
  }

  handleMenuItemSubmit(id) {
    const items = this.submitData[id];

    const params = queryString.parse(this.props.location.search);

    this.props.itemActions.addItems(items, params);
  }

  /// Handle edit button click event
  handleEditMenuItem(id, e) {
    e.stopPropagation();
    this.props.history.push(`/items/${id}/edit`);
  }

  handleEditDataChange(menu_id, item_id, data) {
    if (!this.editData[menu_id]) {
      this.editData[menu_id] = [];
    }

    if (!this.editData[menu_id][item_id]) {
      this.editData[menu_id][item_id] = {};
    }

    this.editData[menu_id][item_id] = {
      ...this.editData[menu_id][item_id],
      ...data
    };
  }

  handleUpdateMenuItem(menu_id, item_id) {
    const params = queryString.parse(this.props.location.search);
    let data = {
      id: item_id,
      item: this.editData[menu_id][item_id],
      params
    };
    this.props.itemActions.updateItem(data);
  }

  /// Handle delete button click event
  handleDeleteMenuItem(id, e) {
    e.stopPropagation();
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        const params = queryString.parse(this.props.location.search);
        this.props.itemActions.deleteItem(id, params);
      }
    });
  }

  renderMenuItems(item) {
    /// If edit data of this item is empty/undefined just initialize with {} object
    if (!this.editData[item.menu_id]) {
      this.editData[item.menu_id] = [];
    }

    if (!this.editData[item.menu_id][item.id]) {
      this.editData[item.menu_id][item.id] = {
        ...item
      };
    }
    ////////////////////////////////////////////////////////////////////////////

    return (
      <div className="p-3 border-bottom" key={item.id}>
        <div className="row">
          <div className="col-md-4">{item.name}</div>
          <div className="col-md-4">
            {item.price / settings.INTEGER_PRECISION}
          </div>
          <div className="col-md-4">
            <Button
              size="sm"
              color="warning"
              id={`toggle_menu_item_edit_${item.menu_id}_${item.id}`}
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              size="sm"
              color="danger"
              onClick={e => {
                this.handleDeleteMenuItem(item.id, e);
              }}
            >
              <i className="fa fa-trash" />
            </Button>
          </div>
        </div>
        <UncontrolledCollapse
          toggler={`toggle_menu_item_edit_${item.menu_id}_${item.id}`}
        >
          <div className="row mt-3">
            <div className="col-md-3">
              <Input
                type="text"
                onChange={evt => {
                  this.handleEditDataChange(item.menu_id, item.id, {
                    name: evt.target.value
                  });
                }}
                placeholder="Name"
                defaultValue={item.name}
              />
            </div>
            <div className="col-md-3">
              <Input
                type="text"
                placeholder="Price"
                onChange={evt => {
                  this.handleEditDataChange(item.menu_id, item.id, {
                    price:
                      parseFloat(evt.target.value) * settings.INTEGER_PRECISION
                  });
                }}
                defaultValue={item.price / settings.INTEGER_PRECISION}
              />
            </div>
            <div className="col-md-3">
              <Input
                type="text"
                onChange={evt => {
                  this.handleEditDataChange(item.menu_id, item.id, {
                    order: evt.target.value
                  });
                }}
                defaultValue={item.order}
                placeholder="Order"
              />
            </div>
            <div className="col-md-3">
              <ImageUploader
                menuId={item.menu_id}
                inputItemIndex={item.id}
                style={imageUploaderStyle}
                image={item.image_url ? settings.BASE_URL + item.image_url : ''}
                handleOnLoad={this.handleOnLoadForEdit}
              />
            </div>
          </div>
          <div>
            <Button
              color="secondary"
              onClick={() => {
                this.handleUpdateMenuItem(item.menu_id, item.id);
              }}
            >
              <i className="fa fa-upload"> Update</i>
            </Button>
          </div>
        </UncontrolledCollapse>
      </div>
    );
  }

  addMenuItemInput(menuId) {
    if (this.submitData[menuId]) {
    } else {
      this.submitData[menuId] = [];
    }

    let defaultItem = {
      order: 1,
      menu_id: menuId
    };

    this.submitData[menuId].push(defaultItem);
    this.forceUpdate();
  }

  renderSubmitItems(menu) {
    if (this.submitData[menu.id] && this.submitData[menu.id].length > 0) {
      // eslint-disable-next-line
      return this.submitData[menu.id].map((item, index) => (
        <div className="row p-3" key={index}>
          <div className="col-md-3">
            <Input
              type="text"
              onChange={evt => {
                this.submitData[menu.id][index] = {
                  ...this.submitData[menu.id][index],
                  name: evt.target.value
                };
              }}
              placeholder="Name"
            />
          </div>
          <div className="col-md-3">
            <Input
              type="text"
              placeholder="Price"
              onChange={evt => {
                this.submitData[menu.id][index] = {
                  ...this.submitData[menu.id][index],
                  price:
                    parseFloat(evt.target.value) * settings.INTEGER_PRECISION
                };
              }}
            />
          </div>
          <div className="col-md-3">
            <Input
              type="text"
              onChange={evt => {
                this.submitData[menu.id][index] = {
                  ...this.submitData[menu.id][index],
                  order: evt.target.value
                };
              }}
              defaultValue={1}
              placeholder="Name"
            />
          </div>
          <div className="col-md-3">
            <ImageUploader
              menuId={menu.id}
              inputItemIndex={index}
              style={imageUploaderStyle}
              handleOnLoad={this.handleOnLoad}
            />
          </div>
        </div>
      ));
    }
  }

  renderMenuTable() {
    const { data } = this.props;

    if (data && data.length > 0) {
      return data.map((menu, index) => (
        <React.Fragment key={index}>
          <tr id={`toggle_menu_${index}`} key={menu.id}>
            <th scope="row"> {index + 1} </th>
            <th>{menu.name}</th>
            <th>{menu.restaurant.name}</th>
            <th>{menu.order}</th>
            <th>
              <Button
                color="warning"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  this.modal_data = menu;
                  this.toggle();
                }}
              >
                <i className="fa fa-edit" />
              </Button>
              <Button
                color="danger"
                onClick={e => {
                  this.handleDelete(menu.id, e);
                }}
              >
                <i className="fa fa-trash" />
              </Button>
            </th>
          </tr>
          <tr>
            <th colSpan={5} style={{ padding: 0 }}>
              <UncontrolledCollapse
                toggler={`toggle_menu_${index}`}
                className="p-3"
              >
                <Button
                  color="default"
                  onClick={() => {
                    this.addMenuItemInput(menu.id);
                  }}
                >
                  <i className="fa fa-plus"> Item</i>
                </Button>
                <Button
                  color="primary"
                  onClick={e => this.handleMenuItemSubmit(menu.id, e)}
                >
                  <i className="fa fa-check"> Submit</i>
                </Button>
                {this.renderSubmitItems(menu)}
                <div className="w-100 border-bottom" />
                {menu.items.map(item => this.renderMenuItems(item))}
              </UncontrolledCollapse>
            </th>
          </tr>
        </React.Fragment>
      ));
    }
  }

  render() {
    const { loading, message } = this.props;

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

    if (this.props.data && this.props.data.length > 0) {
      return (
        <React.Fragment>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Restaurant</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.renderMenuTable()}</tbody>
          </Table>
          <MenuEditModal
            modal={this.state.modal}
            menu={this.modal_data}
            toggle={this.toggle}
            restaurants={
              this.props.restaurant.restaurants
                ? this.props.restaurant.restaurants.data
                : []
            }
          />
        </React.Fragment>
      );
    } else {
      return <div />;
    }
  }
}

export default connect(
  state => ({
    ...state.default.services.item,
    restaurant: state.default.services.restaurant
  }),
  dispatch => ({
    itemActions: bindActionCreators(
      { addItem, deleteItem, addItems, updateItem },
      dispatch
    ),
    menuActions: bindActionCreators({ deleteMenu }, dispatch),
    restaurantActions: bindActionCreators({ getRestaurants }, dispatch)
  })
)(withRouter(MenuTable));
