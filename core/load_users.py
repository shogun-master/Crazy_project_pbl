# core/load_users.py

# from django.contrib.auth.models import User
# # from core.models import Profile

# users = [
#     ("admin@gmail.com", "admin123", "Admin"),
#     ("sarah.j@gmail.com", "frontend123", "Frontend"),
#     ("michael.c@gmail.com", "frontend123", "Frontend"),
#     ("david.s@gmail.com", "backend123", "Backend"),
#     ("emily.b@gmail.com", "backend123", "Backend"),
#     ("sophie.t@gmail.com", "design123", "Designer"),
#     ("alex.r@gmail.com", "design123", "Designer"),
#     ("james.w@gmail.com", "testing123", "QA"),
#     ("lisa.a@gmail.com", "testing123", "QA"),
# ]

# for email, pwd, role in users:
#     if not User.objects.filter(username=email).exists():
#         user = User.objects.create_user(username=email, email=email, password=pwd)
#         Profile.objects.create(user=user, role=role)

# print("✅ Users created successfully!")
