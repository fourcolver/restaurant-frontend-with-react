import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import {
  Button,
  FormGroup,
  Label,
  Input,
  UncontrolledCollapse,
  Card,
  CardImg,
  CardTitle,
  CardImgOverlay,
  Table,
  CardSubtitle
} from 'reactstrap';

// Import Components
import { Pagination } from 'components';

// Import actions
import {
  getCategories,
  deleteCategory
} from 'services/category/categoryActions';
import { showModal } from 'modals/modalConductorActions';

// Import Utility functions
import { errorMsg, updateSearchQueryInUrl } from 'services/utils';

// Import settings
import settings from 'config/settings';

const VIEW_MODE_TILE = 'VIEW_MODE_TILE';
const VIEW_MODE_TABLE = 'VIEW_MODE_TABLE';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      viewMode: VIEW_MODE_TILE
    };

    this.filter = {};

    this.renderCategoriesTable = this.renderCategoriesTable.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.renderFilter = this.renderFilter.bind(this);

    this.onAddClick = this.onAddClick.bind(this);
    this.onPaginationSelect = this.handleSelected.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onViewModeChange = this.handleViewModeChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    // Parse query string and send async api call
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      this.setState({
        activePage: params.page
      });
    }
    this.props.categoryActions.getCategories(params);
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error && this.props.error !== null) {
      let msg = errorMsg(this.props.error);
      toastr.error(msg.title, msg.message);
    }

    if (
      this.props.success !== prevProps.success &&
      this.props.success === true
    ) {
      toastr.success('Success', this.props.message);
    }

    // If query param is changed
    if (prevProps.location.search !== this.props.location.search) {
      const params = queryString.parse(this.props.location.search);
      if (params.page) {
        this.setState({
          activePage: params.page
        });
      }
      this.props.categoryActions.getCategories(params);
    }
  }

  onFilterChange(e) {
    this.filter = {
      ...this.filter,
      [e.target.name]: e.target.value
    };
  }

  onAddClick() {
    this.props.modalActions.showModal('ADD_CATEGORY_MODAL');
  }

  onSearchClick() {
    updateSearchQueryInUrl(this);
  }

  handleViewModeChange(viewMode) {
    this.setState({
      viewMode
    });
  }

  handleSelected(selectedPage) {
    let values = queryString.parse(this.props.location.search);
    values = {
      ...values,
      page: selectedPage
    };

    const searchQuery = queryString.stringify(values);
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: `?${searchQuery}`
    });
  }

  /// Handle edit button click event
  onEdit(category, e) {
    e.stopPropagation();
    this.props.modalActions.showModal('EDIT_CATEGORY_MODAL', category);
  }

  /// Handle delete button click event
  handleDelete(id, e) {
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
        this.props.categoryActions.deleteCategory(id);
      }
    });
  }

  renderCategoriesTable() {
    if (this.props.categories) {
      const { data } = this.props.categories;

      if (data && data.length > 0) {
        const categoryTableRows = data.map((category, index) => (
          <tr key={category.id}>
            <th scope="row"> {index + 1} </th>
            <th>
              <Link
                to={{
                  pathname: '/restaurants',
                  search: `?category=${category.id}`
                }}
              >
                {category.name}
              </Link>
            </th>
            <th>{category.city.name}</th>
            <th>{category.is_open ? 'Opened' : 'Closed'}</th>
            <th>{category.order}</th>
            <th>
              <Button
                color="warning"
                onClick={e => {
                  this.onEdit(category, e);
                }}
              >
                <i className="fa fa-edit" />
              </Button>
              <Button
                color="danger"
                onClick={e => {
                  this.onDelete(category.id, e);
                }}
              >
                <i className="fa fa-trash" />
              </Button>
            </th>
          </tr>
        ));
        return (
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>City</th>
                <th>Open/Closed</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{categoryTableRows}</tbody>
          </Table>
        );
      } else {
        return <div>No Categories Data to list</div>;
      }
    }
  }

  renderCategoriesTile() {
    if (this.props.categories) {
      const { data } = this.props.categories;

      if (data && data.length > 0) {
        return data.map((category, index) => {
          let closedSz = '';
          if (!category.is_open) {
            closedSz = '(Closed)';
          }

          return (
            <div
              key={index}
              className="col-sm-3 col-xs-12 mb-3 d-flex align-items-stretch"
              onClick={() => {
                this.props.history.push(`/restaurants?category=${category.id}`);
              }}
            >
              <Card className="text-center w-100">
                <CardImg
                  top
                  width="100%"
                  className="h-100"
                  src={settings.BASE_URL + category.image_url}
                  alt={category.name}
                />
                <div className="normal-tile-overlay" />
                <CardImgOverlay>
                  <CardTitle className="tile-view-card-title">
                    {category.name + closedSz}
                  </CardTitle>
                  <CardSubtitle className="text-white">
                    {category.city ? category.city.name : 'N/A'}
                  </CardSubtitle>
                  <div className="card-buttons-hover-show">
                    <Button
                      size="sm"
                      color="warning"
                      onClick={e => {
                        this.onEdit(category, e);
                      }}
                    >
                      <i className="fa fa-edit" />
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={e => {
                        this.handleDelete(category.id, e);
                      }}
                    >
                      <i className="fa fa-trash" />
                    </Button>
                  </div>
                </CardImgOverlay>
              </Card>
            </div>
          );
        });
      } else {
        return <div>No Categories Data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.categories &&
      this.props.categories.meta &&
      this.props.categories.data &&
      this.props.categories.data.length > 0
    ) {
      return (
        <Pagination
          totalItems={this.props.categories.meta.total}
          pageSize={parseInt(this.props.categories.meta.per_page)}
          onSelect={this.handleSelected}
          activePage={parseInt(this.state.activePage)}
        />
      );
    }
  }

  renderFilter() {
    return (
      <div>
        {/* Action button */}
        <Button color="default" onClick={this.onAddClick}>
          <i className="fa fa-plus" />
          &nbsp;Add category
        </Button>
        <Button id="toggle_category" color="warning">
          Open filter&nbsp;
          <i className="fa fa-filter" />
        </Button>
        <Button onClick={() => this.handleViewModeChange(VIEW_MODE_TILE)}>
          <i className="fa fa-th" />
        </Button>
        <Button onClick={() => this.handleViewModeChange(VIEW_MODE_TABLE)}>
          <i className="fa fa-th-list" />
        </Button>
        <UncontrolledCollapse
          toggler="#toggle_category"
          className="col-md-8 col-sm-12 mt-5 mb-5"
        >
          <FormGroup>
            <Label>Category name</Label>
            <Input
              type="text"
              name="category_name"
              onChange={this.onFilterChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>City name</Label>
            <Input
              type="text"
              name="city_name"
              onChange={this.onFilterChange}
            />
          </FormGroup>
          <Button onClick={this.onSearchClick}>
            <i className="fa fa-search" />
            Search
          </Button>
        </UncontrolledCollapse>
      </div>
    );
  }

  render() {
    const { loading, message } = this.props;

    // if loading status show sweet alert
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
        <h1 className="text-center mb-5">Categories</h1>
        <div className="mb-3">
          {/* Render category filter section */}
          {this.renderFilter()}
        </div>

        {/* Table */}
        <div className="d-flex flex-column">
          {/* Render categories table */}
          {this.state.viewMode === VIEW_MODE_TABLE ? (
            this.renderCategoriesTable()
          ) : (
            <div className="row">{this.renderCategoriesTile()}</div>
          )}
          {/* Render pagination */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.category
  }),
  dispatch => ({
    categoryActions: bindActionCreators(
      { getCategories, deleteCategory },
      dispatch
    ),
    modalActions: bindActionCreators({ showModal }, dispatch)
  })
)(List);
