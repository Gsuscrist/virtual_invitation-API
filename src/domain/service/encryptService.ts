export interface EncryptService{
    execute(data: any): Promise<any>
    compare(data: any, hash: any): Promise<any>
}