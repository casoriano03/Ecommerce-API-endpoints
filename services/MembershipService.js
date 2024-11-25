class MembershipService {
    constructor(db) {
        this.client = db.sequelize;
        this.Membership = db.Membership;
        this.User = db.User;
        this.Order = db.Order;
        this.MembershipStatus = db.MembershipStatus;
        
    }

    async create(ItemCount, UserId, MembershipStatusId) {
        try{
            const newMembership = await this.Membership.create({
                ItemCount: ItemCount,
                UserId: UserId,
                MembershipStatusId: MembershipStatusId
            })
            return newMembership;
        } catch(error) {
            console.log("Error creating Brand:" + error)
        }
    }

    async get() {
        try{
            const memberships = await this.Membership.findAll({
            where: {}
            })
            return memberships;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }

    async getOne(UserId) {
        try{
            const memberships = await this.Membership.findOne({
            where: {UserId: UserId}
            })
            return memberships;
        } catch(error) {
            console.log("Error getting Brands:" + error)
        }
    }

    async updateMembership(MembershipId, NewItemCount, NewMembershipStatusId){
        try {
            const updatedMembership = await this.Membership.update({
                MembershipStatusId: NewMembershipStatusId,
                ItemCount: NewItemCount
            },{
            where:{id:MembershipId}
            })
            return updatedMembership;
        } catch(error) {
            console.log("Error updating Brand:" + error)
        }
    }


    async deleteMembership(MembershipId) {
        try{
            const membership = await this.Membership.destroy({
            where: {id: MembershipId}
            })
            return membership;
        } catch(error) {
            console.log("Error deleting Brand:" + error)
        }
    }

}
module.exports = MembershipService;