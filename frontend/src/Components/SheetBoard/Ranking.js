import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getRanking } from "./../../APIs/User";

function Ranking() {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const getData = async () => {
      if (user && user.primaryEmailAddress) {
        let res = await getRanking({
          email: user.primaryEmailAddress.emailAddress,
        });
        if (res && Array.isArray(res?.data)) {
          const usersCopy = [...res?.data];
          const lastUser = usersCopy.pop();
          setMe(lastUser);
          setUsers(usersCopy);
        }
      }
    };
    getData();
  }, [user]);

  return (
    <div className="bg-Color02 h-auto w-72 rounded-lg mb-10 border-2 border-Color06">
      <h1 className="text-xl bg-Color05 text-white p-4 font-semibold rounded-t-lg border-b-2 border-Color06">
        Ranking
      </h1>
      {me && (
        <div className="flex items-center p-2 bg-blue-200 bg-opacity-50 text-blue-800 m-2 rounded-md">
          <h1 className="font-bold text-xl mr-2">{me.SubmissionNumber}.</h1>
          <img
            src={me.Profile}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-4"
          />
          <h1 className="font-semibold mr-4 text-blue-800">{me.Rating}</h1>
          <h1 className="font-semibold w-40 text-right mr-2 text-sm text-blue-800">
            Me
          </h1>
        </div>
      )}
      <div>
        {users.length > 0 ? (
          users.map((rank, index) => (
            <div
              key={index}
              className="flex items-center p-2 bg-Color04 text-Color07 m-2 rounded-md"
            >
              <h1 className="font-bold text-xl mr-2">{index + 1}.</h1>
              <img
                src={rank.Profile}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4"
              />
              <h1 className="font-semibold mr-4">{rank.Rating}</h1>
              <h1 className="font-semibold w-40 text-right mr-2 text-sm text-red-100">
                {rank.Name}
              </h1>
            </div>
          ))
        ) : (
          <p className="p-4 text-Color07 text-center mt-10">
            No rankings available
          </p>
        )}
      </div>
    </div>
  );
}

export default Ranking;
