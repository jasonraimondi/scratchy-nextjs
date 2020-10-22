import { useUser } from "@/app/lib/api/user";
import { apiUsersFetcher } from "@/app/lib/api/users";
import React from "react";

import { Layout } from "@/app/components/layouts/layout";

export async function getStaticProps() {
  const users = await apiUsersFetcher()
  return { props: { users: users } }
}

export default function IndexPage({ users }: any) {
  const { data, error, isValidating } = useUser("jason@raimondi.us", { initialData: users });

  let body;

  if (error) {
    body = <div>failed to load</div>;
  } else if (isValidating) {
    body = <div>loading...</div>;
  } else {
    const users = data.users.data.map((user: any) => <div>
      <p>{user.name} - {user.email}</p>
    </div>);
    body = <div>
      <div>{users}</div>
    </div>;
  }

  return <Layout title="Home">{body}</Layout>;
};
