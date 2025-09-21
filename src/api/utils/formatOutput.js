

export default (res,status,data=null,error=null) => {
    return res.status(status).json({
        data: data,
        status: status,
        error: error,
        isSuccess: status == 200 || status == 201
    })
};
