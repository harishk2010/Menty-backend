export interface IEmail {
    sentEmailVerification(name: string, email: string, verification: string) : Promise <boolean>
}