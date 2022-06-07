import React from "react";
import CardSkeleton from "./CardSkeleton";
const mockData = [1, 2, 3, 4, 5, 6, 7, 8];
const ListSkeleton = ({page}) => {
    return(<>
        {mockData.map((item) => <CardSkeleton key={"cardSkeleton-" + item} page={page}/>)}
    </>)
}
export default  React.memo(ListSkeleton);
