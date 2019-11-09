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
import MenuTable from './components/MenuTable';
import { Pagination } from 'components';

// Import Actions
import { getMenus } from 'services/menu/menuActions';
import { showModal } from 'modals/modalConductorActions';

// Import Utility functions
import { errorMsg, updateSearchQueryInUrl } from 'services/utils';
import queryString from 'query-string';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1
    };

    this.renderMenus = this.renderMenus.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
    this.onPaginationSelect = this.onPaginationSelect.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onSearchClick = this.handleSearchClick.bind(this);
  }

  componentWillMount() {
    // Dispatch GET_CITIES action to generate cities list
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      this.setState({
        activePage: params.page
      });
    }

    this.props.menuActions.getMenus(params);
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
      this.props.menuActions.getMenus(params);
    }
  }

  onFilterChange(e) {
    this.filter = {
      ...this.filter,
      [e.target.name]: e.target.value
    };
  }

  onAddClick() {
    this.props.modalActions.showModal('MENU_ADD_MODAL');
  }

  handleSearchClick() {
    updateSearchQueryInUrl(this);
  }

  onPaginationSelect(selectedPage) {
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

  renderMenus() {
    if (this.props.menus) {
      const { data } = this.props.menus;

      if (data && data.length > 0) {
        return (
          <MenuTable
            data={data}
            from={this.props.menus.meta ? this.props.menus.meta.from : ''}
          />
        );
      } else {
        return <div>No Menu data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.menus &&
      this.props.menus.meta &&
      this.props.menus.data &&
      this.props.menus.data.length > 0
    ) {
      return (
        <Pagination
          totalItems={this.props.menus.meta.total}
          pageSize={parseInt(this.props.menus.meta.per_page)}
          onSelect={this.onPaginationSelect}
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
        <h1 className="text-center mb-5">Menus</h1>
        <div className="mb-3">
          {/* Action button */}
          <Button color="default" onClick={this.onAddClick}>
            <i className="fa fa-plus" />
            &nbsp;Add menu
          </Button>
          <Button id="toggle_menu" color="warning">
            Open filter&nbsp;
            <i className="fa fa-filter" />
          </Button>
        </div>
        {/* Filter Box*/}
        <UncontrolledCollapse
          toggler="#toggle_menu"
          className="col-md-8 col-sm-12 mt-5 mb-5"
        >
          <FormGroup>
            <Label>Menu</Label>
            <Input
              type="text"
              name="menu_name"
              onChange={this.onFilterChange}
            />
          </FormGroup>
          <Button onClick={this.handleSearchClick}>
            <i className="fa fa-search" />
            Search
          </Button>
        </UncontrolledCollapse>
        <div className="d-flex flex-column">
          {/* Render menu table */}
          {this.renderMenus()}
          {/* Render pagination */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.menu
  }),
  dispatch => ({
    menuActions: bindActionCreators({ getMenus }, dispatch),
    modalActions: bindActionCreators({ showModal }, dispatch)
  })
)(List);
