export interface register{
    name: string,
    email: string,
    password: string
}

export interface findUsers{
    email: string,
    is_verified?: boolean
}

export interface updateUser1{
    where:{
        id: number
    },
    data:{
        verification_token: string
    }
}

export interface updateUser2{
    where:{
        email: string
    },
    data:{
        is_verified: boolean, 
        verification_token: null
    }
}