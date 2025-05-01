import { asyncHandler } from "../Utils/asyncHandler";

const createGroup = asyncHandler(async(req, res) => {
    const {groupName, members} = req.body;
})