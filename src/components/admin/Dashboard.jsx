import { useEffect, useState } from "react";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";
import { getAppInfo } from "../../api/admin";
import { useNotification } from "../../hooks";
import MostRatedMovies from "../MostRatedMovies";

export default function Dashboard() {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount: 0,
    userCount: 0,
  });

  const { updateNotification } = useNotification();

  const fetchAppInfo = async () => {
    //send backend request to fetch app info like movie count, etc
    const { appInfo, error } = await getAppInfo();

    // if any error
    if (error) return updateNotification("error", error);

    //set the app info
    setAppInfo({ ...appInfo });
  };

  // fetch app info when we  render this page
  useEffect(() => {
    fetchAppInfo();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      {/* TOTAL UPLOADS */}
      {/* toLocaleString is to add commas like 1255 -> 1,255 */}
      <AppInfoBox
        title="Total Uploads"
        subTitle={appInfo.movieCount.toLocaleString()}
      />
      {/* TOTAL REVIEWS */}
      <AppInfoBox
        title="Total Reviews"
        subTitle={appInfo.reviewCount.toLocaleString()}
      />
      {/* TOTAL USERS */}
      <AppInfoBox
        title="Total Users"
        subTitle={appInfo.userCount.toLocaleString()}
      />

      <LatestUploads />
      <MostRatedMovies />

    </div>
  );
}
