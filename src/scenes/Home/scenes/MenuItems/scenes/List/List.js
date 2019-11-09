import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import {
  Button,
  FormGroup,
  Label,
  Input,
  UncontrolledCollapse
} from 'reactstrap';

// Import Components
import MenuItemTable from './components/MenuItemTable';
import { Pagination } from 'components';

// Import Actions
import { getItems } from 'services/item/itemActions';

// Import Utility functions
import { errorMsg, updateSearchQueryInUrl } from 'services/utils';
import queryString from 'query-string';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1
    };

    this.onAddClick = this.handleAddClick.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.onPaginationSelect = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onSearchClick = this.handleSearchClick.bind(this);
  }

  componentDidMount() {
    // Parse query string and send async api call
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      this.setState({
        activePage: params.page
      });
    }
    this.props.itemActions.getItems(params);
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
      this.props.itemActions.getItems(params);
    }
  }

  onFilterChange(e) {
    this.filter = {
      ...this.filter,
      [e.target.name]: e.target.value
    };
  }

  handleAddClick() {
    this.props.history.push('/items/add');
  }

  handleSearchClick() {
    updateSearchQueryInUrl(this);
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

  renderItems() {
    if (this.props.items) {
      const { data } = this.props.items;

      if (data && data.length > 0) {
        return (
          <MenuItemTable
            data={data}
            from={this.props.items.meta ? this.props.items.meta.from : ''}
          />
        );
      } else {
        return <div>No Menu data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.items &&
      this.props.items.meta &&
      this.props.items.data &&
      this.props.items.data.length > 0
    ) {
      return (
        <Pagination
          totalItems={this.props.items.meta.total}
          pageSize={parseInt(this.props.items.meta.per_page)}
          onSelect={this.handleSelected}
          activePage={parseInt(this.state.activePage)}
        />
      );
    }
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
        <h1 className="text-center mb-5">Items</h1>
        <div className="mb-3">
          {/* Action button */}
          <Button color="default" onClick={this.handleAddClick}>
            <i className="fa fa-plus" />
            &nbsp;Add item
          </Button>
          <Button id="toggler" color="warning">
            Open filter&nbsp;
            <i className="fa fa-filter" />
          </Button>
        </div>
        {/* Filter Box*/}
        <UncontrolledCollapse
          toggler="#toggler"
          className="col-md-8 col-sm-12 mt-5 mb-5"
        >
          <FormGroup>
            <Label>Item</Label>
            <Input
              type="text"
              name="item_name"
              onChange={this.onFilterChange}
            />
          </FormGroup>
          <Button onClick={this.handleSearchClick}>
            <i className="fa fa-search" />
            Search
          </Button>
        </UncontrolledCollapse>
        <div className="d-flex flex-column">
          {/* Render Menu items table*/}
          {this.renderItems()}
          {/* Render pagination */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.item
  }),
  dispatch => ({
    itemActions: bindActionCreators({ getItems }, dispatch)
  })
)(List);
