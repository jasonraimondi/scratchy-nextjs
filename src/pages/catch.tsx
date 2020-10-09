import { GetServerSidePropsContext } from "next";
import React from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: context.query, // will be passed to the page component as props
  }
}

function CatchPage(props: any) {
  return <p>{JSON.stringify(props)}</p>
}

export default CatchPage;
