class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :user_availabilities, dependent: :destroy
  has_many :events, through: :user_availabilities
  # has_secure_password validations: false

  validates :name, presence: true

  def email_required?
    false
  end

  def password_required?
    false
  end

  def will_save_change_to_email?
    false
  end

  def will_save_change_to_encrypted_password?
    false
  end

  # def as_json(options = {})
  #   super({ except: [ :password_digest ] }.merge(options))
  # end
end


# class User < ApplicationRecord
#   # Include default devise modules. Others available are:
#   # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
#   devise :database_authenticatable, :registerable,
#          :recoverable, :rememberable, :validatable

#   has_many :user_availabilities, dependent: :destroy
#   has_many :events, through: :user_availabilities
#   # has_secure_password validations: false

#   validates :name, presence: true

#   # def as_json(options = {})
#   #   super({ except: [ :password_digest ] }.merge(options))
#   # end
# end
