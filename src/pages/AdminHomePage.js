import React, { useContext, useEffect, useState } from "react";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem, Spinner } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../components/Component";

import Content from "../layout/content/Content";
import { Link } from "react-router-dom";
import moment from "moment";
import { deleteJobs } from "../services/apis";
import { JobsContext } from "../contexts/JobsContext";
import Head from "../layout/head/Head";
import { getTime } from "../utils/Utils";

export const JobTypeOptions = [
  { value: "partime", label: "Partime" },
  { value: "fulltime", label: "Fulltime" },
  { value: "freelancer", label: "Freelancer" },
];

const AdminSettings = () => {
  const { loading, data, setJobList, fetchJobs } = useContext(JobsContext);

  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [keyword, setkeyword] = useState("");

  const [Jobstatus, setJobstatus] = useState(null);
  const [JobType, setJobType] = useState(null);
  const [hiringStatus, setHiringStatus] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("asc");

  const params = () => {
    const params = { limit, page, sortBy: "createdAt:" + sortBy };
    if (keyword) {
      params.keyword = keyword;
    }

    if (Jobstatus) params.active = Jobstatus.value;
    if (JobType) params.type = JobType.value;
    if (hiringStatus) params.hiringStatus = hiringStatus.value;

    return params;
  };

  useEffect(() => {
    fetchJobs(params());
  }, [page, limit, sortBy, keyword, Jobstatus, JobType, hiringStatus]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setkeyword(e.target.value);
  };

  const toggle = () => setonSearch(!onSearch);
  const currentItems = data.results;

  const paginate = (page) => setPage(page);

  const selectorCheck = (e) => {
    let newData;
    newData = data.results.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setJobList({ ...data, results: [...newData] });
  };

  const onSelectChange = (e, id) => {
    let newData;
    newData = data.results.map((item) => {
      if (item._id === id) {
        item.checked = e.currentTarget.checked;
      }
      return item;
    });
    setJobList({ ...data, results: [...newData] });
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const onDelete = () => {
    setDeleteLoading(true);
    let jobs = data.results.filter((item) => item.checked === true);
    deleteJobs({
      jobs: jobs.map((item) => {
        return { _id: item._id };
      }),
    })
      .then((_) => {
        setDeleteLoading(false);
        fetchJobs(params());
      })
      .catch((error) => {
        console.log(error);
        setDeleteLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Head title="Admin Home Page"></Head>
      <Content>
        <BlockHead size="sm">
          <div className="d-flex justify-content-between align-center">
            <BlockTitle page>App homepage management.</BlockTitle>
            <h6 className="w-400px text-wrap">
              *When registering, you will be exposed to the app's home screen &gt; service introduction area.
            </h6>
          </div>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch text-center">
            <DataTableBody>
              <DataTableHead>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label className="custom-control-label" htmlFor="uid"></label>
                  </div>
                </DataTableRow>
                <DataTableRow size="mb">
                  <span className="sub-text p-2">Number </span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text p-2">Title</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text p-2">Author's email.</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text p-2">Writing date</span>
                </DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {currentItems.length > 0
                ? currentItems.map((item, index) => {
                    return (
                      <DataTableItem key={item._id}>
                        <DataTableRow className="nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              defaultChecked={item.checked}
                              id={item._id}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item._id)}
                            />
                            <label className="custom-control-label" htmlFor={item._id}></label>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <span>{index + 1}</span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <Link className="text-decoration-underline" to={`#`}>
                            App homepage image v.01
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.company?.email}</span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span>{moment(item.startingDate).format("YYYY-MM-DD hh:mm")}</span>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <ul className="align-center justify-content-between flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button
                      color="danger"
                      size="md"
                      disabled={!currentItems.some((item) => item.checked === true)}
                      onClick={() => {
                        onDelete();
                      }}
                    >
                      {deleteLoading ? <Spinner size="sm" color="light" /> : "Delete the selection."}
                    </Button>
                  </li>
                  <li>
                    <PaginationComponent
                      itemPerPage={limit}
                      totalItems={data.totalResults}
                      paginate={paginate}
                      currentPage={page}
                    />
                  </li>
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/admin-homepage-management/register`}>
                      <Button color="primary" size="md">
                        {"Registration"}
                      </Button>
                    </Link>
                  </li>
                </ul>
              ) : (
                <div className="text-center">
                  <span className="text-silent">{!loading && "No data found"}</span>
                  {loading && (
                    <div className="loading-layer">
                      <Spinner color="primary" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default AdminSettings;
