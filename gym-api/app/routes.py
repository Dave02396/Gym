from flask_restful import Api
from app import app
from app.resources.auth_resource import LoginResource
from app.resources.role_resource import RoleResource
from app.resources.user_resource import UserResource, ManageUserResource
from app.resources.class_resource import ClassResource, ManageClassResource
from app.resources.booking_resource import BookingResource, ManageBookingResource

api = Api(app, prefix='/api/v1')

# Auth
api.add_resource(LoginResource, '/auth/login')

# Roles
api.add_resource(RoleResource, '/roles')

# Usuarios
api.add_resource(UserResource, '/users')
api.add_resource(ManageUserResource, '/users/<int:id>')

# Clases
api.add_resource(ClassResource, '/classes')
api.add_resource(ManageClassResource, '/classes/<int:id>')

# Reservas
api.add_resource(BookingResource, '/bookings')
api.add_resource(ManageBookingResource, '/bookings/<int:id>')