import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../base-components/Table";
import { fetchCmsDescription } from "../../stores/cms";
import { RootState, AppDispatch } from "../../stores/store";
import PageHeader from './../../components/PageHeader/index';
import CustomLoader from "../../components/Loader/CustomLoader";

const ViewDescription = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cmsData = useSelector((state: RootState) => state.cms.cmsData);
  const loading = useSelector((state: RootState) => state.cms.loading);
  const navigate = useNavigate();
  const location = useLocation();
  const { cmsId } = location.state || {};

  useEffect(() => {
    if (!cmsId) {
      navigate("/cms", { replace: true });
      return;
    }

    dispatch(fetchCmsDescription({ cmsId: cmsId, isRelease: true }));
  }, [cmsId, dispatch, navigate]);

  if (!cmsId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">
          Invalid CMS ID. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        HeaderText="Details"
        Breadcrumb={[{ name: "View Description", navigate: "#" }]}
        to="/cms"
      />
      <div className="mt-3">
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          {loading ? (
            <div className="flex justify-center mt-10">
              <CustomLoader color="fill-orange-600" />
            </div>
          ) : (
            <Table className="border-spacing-y-[10px] border-separate -mt-2">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Version Number
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Description
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Platform
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Is Force Update
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {cmsData.length > 0 ? (
                  cmsData.map((item, idx) => (
                    <Table.Tr key={idx} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.VersionNumber}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.Description}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.Platform}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.IsForceUpdate ? "Yes" : "No"}
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={4} className="text-center">
                      No CMS description found
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDescription;
