class MembershipStatusService {
    constructor(db) {
        this.client = db.sequelize;
        this.MembershipStatus = db.MembershipStatus;
        this.Membership = db.Membership;
        
    }

    async create(MembershipStatus, Discount) {
        try{
            const newMembershipStatus = await this.MembershipStatus.create({
                MembershipStatus: MembershipStatus,
                Discount: Discount
            })
            return newMembershipStatus;
        } catch(error) {
            console.log("Error creating Brand:" + error)
        }
    }

    async get() {
        try{
            const membershipStatuses = await this.MembershipStatus.findAll({
            where: {}
            })
            return membershipStatuses;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }

    async getOne(MembershipStatus) {
        try{
            const membershipStatuses = await this.MembershipStatus.findOne({
            where: {MembershipStatus: MembershipStatus}
            })
            return membershipStatuses;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }

    async getOneId(MembershipStatusId) {
        try{
            const membershipStatuses = await this.MembershipStatus.findOne({
            where: {id: MembershipStatusId}
            })
            return membershipStatuses;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }

    async updateMembershipStatus(MembershipStatusId, NewMembershipStatus, NewDiscount ){
        try {
            const updatedMembershipStatus = await this.MembershipStatus.update({
                MembershipStatus: NewMembershipStatus,
                Discount: NewDiscount
            },{
            where:{id:MembershipStatusId}
            })
            return updatedMembershipStatus;
        } catch(error) {
            console.log("Error updating Brand:" + error)
        }
    }


    async deleteMembershipStatus(MembershipStatusId) {
        try{
            const membershipStatus = await this.MembershipStatus.destroy({
            where: {id: MembershipStatusId}
            })
            return membershipStatus;
        } catch(error) {
            console.log("Error deleting Brand:" + error)
        }
    }

}
module.exports = MembershipStatusService;