import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import CSVParse from 'csv-parse';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

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
  Table
} from 'reactstrap';
import queryString from 'query-string';
import { csv2array } from 'services/utils';
// Import Components
import { Pagination } from 'components';

// Import actions
import { getCities, deleteCity, addCities } from 'services/city/cityActions';
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
      activePage: 1, // Handle pagination active
      viewMode: VIEW_MODE_TILE
    };

    this.filter = {};

    this.renderCitiesTable = this.renderCitiesTable.bind(this);
    this.renderCitiesTile = this.renderCitiesTile.bind(this);
    this.renderFilter = this.renderFilter.bind(this);
    this.renderPagination = this.renderPagination.bind(this);

    this.onPaginationSelect = this.onPaginationSelect.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onViewModeChange = this.onViewModeChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onClickAddCityFromExcel = this.onClickAddCityFromExcel.bind(this);
    this.onChangeCSVFile = this.onChangeCSVFile.bind(this);
  }

  componentDidMount() {
    // Parse query string and send endpoint call
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      this.setState({
        activePage: params.page
      });
    }
    this.props.cityActions.getCities(params);
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

        this.props.cityActions.getCities(params);
      }
    }
  }

  onFilterChange(e) {
    this.filter = {
      ...this.filter,
      [e.target.name]: e.target.value
    };
  }

  onSearchClick() {
    updateSearchQueryInUrl(this);
  }

  onViewModeChange(viewMode) {
    this.setState({
      viewMode
    });
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

  onClickAddCityFromExcel() {
    this.csvUploader.click();
  }

  onChangeCSVFile(event) {
    let file = event.target.files[0];

    console.log(file);
    const fileReader = new FileReader();
    const output = [];
    fileReader.onload = () => {
      const params = queryString.parse(this.props.location.search);

      CSVParse(fileReader.result, {})
        .on('readable', function() {
          let record;
          while ((record = this.read())) {
            let item = {};
            item['created_at'] = moment().format('YYYY-MM-DD HH:mm:ss');
            item['updated_at'] = moment().format('YYYY-MM-DD HH:mm:ss');
            item['name'] = record[0];
            item['order'] = record[1];
            item['image_url'] = record[2];
            item['is_open'] = record[3];
            output.push(item);
          }
        })
        .on('end', () => {
          console.log('output array here');
          output.splice(0, 1);
          console.log(output);

          this.props.cityActions.addCities(output, params);
        });
    };
    fileReader.readAsBinaryString(file);
  }

  onEdit(city, e) {
    e.stopPropagation();
    this.props.modalActions.showModal('EDIT_CITY_MODAL', city);
  }

  /// Handle delete button click event
  onDelete(id, e) {
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
        this.props.cityActions.deleteCity(id);
      }
    });
  }

  renderCitiesTable() {
    if (this.props.cities) {
      const { data } = this.props.cities;

      if (data && data.length > 0) {
        const cityTableRows = data.map((city, index) => (
          <tr key={city.id}>
            <th scope="row"> {index + 1} </th>
            <th>
              <Link
                to={{
                  pathname: '/restaurants',
                  search: `?city=${city.id}`
                }}
              >
                {city.name}
              </Link>
            </th>
            <th>{city.is_open ? 'Opened' : 'Closed'}</th>
            <th>{city.order}</th>
            <th>
              <Button
                color="warning"
                onClick={e => {
                  this.onEdit(city, e);
                }}
              >
                <i className="fa fa-edit" />
              </Button>
              <Button
                color="danger"
                onClick={e => {
                  this.onDelete(city.id, e);
                }}
              >
                <i className="fa fa-trash" />
              </Button>
            </th>
          </tr>
        ));

        return (
          <div>
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Open</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{cityTableRows}</tbody>
            </Table>
          </div>
        );
      } else {
        return <div>No City Data to list</div>;
      }
    }
  }

  renderCitiesTile() {
    if (this.props.cities) {
      const { data } = this.props.cities;

      if (data && data.length > 0) {
        return data.map((city, index) => {
          let closedSz = '';
          if (!city.is_open) {
            closedSz = '(Closed)';
          }

          let image_url = city.image_url;
          if (image_url.substring(0, 4) !== 'http') {
            image_url = settings.BASE_URL + image_url;
          }
          return (
            <div
              key={index}
              className="col-sm-3 col-xs-12 mb-3 d-flex align-items-stretch"
              onClick={() => {
                this.props.history.push(`/restaurants?city=${city.id}`);
              }}
            >
              <Card className="text-center w-100">
                <CardImg
                  top
                  width="100%"
                  className="h-100 city-image-tile"
                  src={image_url}
                  alt={city.name}
                />
                <div className="overlay-color" />
                <CardImgOverlay>
                  <CardTitle className="tile-view-card-title">
                    {city.name + closedSz}
                  </CardTitle>
                  <div className="card-buttons-hover-show">
                    <Button
                      size="sm"
                      color="warning"
                      onClick={e => {
                        this.onEdit(city, e);
                      }}
                    >
                      <i className="fa fa-edit" />
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={e => {
                        this.onDelete(city.id, e);
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
        return <div>No City Data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.cities &&
      this.props.cities.meta &&
      this.props.cities.data &&
      this.props.cities.data.length > 0
    ) {
      return (
        <Pagination
          totalItems={this.props.cities.meta.total}
          pageSize={parseInt(this.props.cities.meta.per_page)}
          onSelect={this.onPaginationSelect}
          activePage={parseInt(this.state.activePage)}
        />
      );
    }
  }

  renderFilter() {
    return (
      <div>
        {/* Action button */}
        <Button
          color="default"
          onClick={() => {
            this.props.modalActions.showModal('ADD_CITY_MODAL');
          }}
        >
          <i className="fa fa-plus" />
          &nbsp;Add city
        </Button>
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={this.onChangeCSVFile}
          ref={ref => {
            this.csvUploader = ref;
          }}
        />
        <Button color="default" onClick={this.onClickAddCityFromExcel}>
          <i className="fa fa-file-excel-o" />
          &nbsp;Add city from CSV
        </Button>
        <Button id="toggle_city" color="warning">
          Open filter&nbsp;
          <i className="fa fa-filter" />
        </Button>
        <Button onClick={() => this.onViewModeChange(VIEW_MODE_TILE)}>
          <i className="fa fa-th" />
        </Button>
        <Button onClick={() => this.onViewModeChange(VIEW_MODE_TABLE)}>
          <i className="fa fa-th-list" />
        </Button>
        <UncontrolledCollapse
          toggler="#toggle_city"
          className="col-md-8 col-sm-12 mt-5 mb-5"
        >
          <FormGroup>
            <Label>City</Label>
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

    /// if loading status show sweet alert
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
        {/* Page title */}
        <h1 className="text-center mb-5">Cities</h1>
        <div className="mb-3">
          {/* Render city filter section */}
          {this.renderFilter()}
        </div>

        <div className="d-flex flex-column">
          {/* Render city table */}
          {this.state.viewMode === VIEW_MODE_TABLE ? (
            this.renderCitiesTable()
          ) : (
            <div className="row">{this.renderCitiesTile()}</div>
          )}
          {/* Render table pagination */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

List = withRouter(List);

export default connect(
  state => ({
    ...state.default.services.city
  }),
  dispatch => ({
    cityActions: bindActionCreators(
      { addCities, getCities, deleteCity },
      dispatch
    ),
    modalActions: bindActionCreators({ showModal }, dispatch)
  })
)(List);
