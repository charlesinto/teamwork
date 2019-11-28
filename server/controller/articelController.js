import { trimWhiteSpace, executeQuery, displayMessage } from "../helper";
import { createNewArticle } from "../scripts/Articles";

export const createArticle = async (req, res) => {
    try{
        const request = trimWhiteSpace(req.body)
        const {title, article} = request;
        const {id} = req.user
        await executeQuery(createNewArticle(), [title, article, id])
        displayMessage(res, 201, {
            status:"success",
            data:{
                message:"Article created successfully",
                title,
                article
            }
        })

    }catch(err){
        console.log('some errors encountered', err );
        return displayMessage(res, 500, err)
    }
}