
#!/bin/bash

# Define the templates directory
TEMPLATES_DIR="templates/core"

# Create the directory structure
mkdir -p $TEMPLATES_DIR

# Create admin_dashboard.html
cat > $TEMPLATES_DIR/admin_dashboard.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
</head>
<body>
    <h1>Admin Dashboard</h1>
    <p>Welcome, {{ request.user.username }} (Admin)</p>
    <ul>
        <li><a href="#">Create Task</a></li>
        <li><a href="#">Manage Users</a></li>
        <li><a href="#">View All Tasks</a></li>
    </ul>
    <a href="{% url 'logout' %}">Logout</a>
</body>
</html>
EOF

# Create frontend_dashboard.html
cat > $TEMPLATES_DIR/frontend_dashboard.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Frontend Developer Dashboard</title>
</head>
<body>
    <h1>Frontend Developer Dashboard</h1>
    <p>Welcome, {{ request.user.username }}</p>
    <p>View and update your assigned frontend tasks here.</p>
    <a href="{% url 'logout' %}">Logout</a>
</body>
</html>
EOF

# Create backend_dashboard.html
cat > $TEMPLATES_DIR/backend_dashboard.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Backend Developer Dashboard</title>
</head>
<body>
    <h1>Backend Developer Dashboard</h1>
    <p>Welcome, {{ request.user.username }}</p>
    <p>View and update your backend tasks here.</p>
    <a href="{% url 'logout' %}">Logout</a>
</body>
</html>
EOF

# Create designer_dashboard.html
cat > $TEMPLATES_DIR/designer_dashboard.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Designer Dashboard</title>
</head>
<body>
    <h1>Designer Dashboard</h1>
    <p>Welcome, {{ request.user.username }}</p>
    <p>Access and track your design-related tasks here.</p>
    <a href="{% url 'logout' %}">Logout</a>
</body>
</html>
EOF

# Create qa_dashboard.html
cat > $TEMPLATES_DIR/qa_dashboard.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>QA Tester Dashboard</title>
</head>
<body>
    <h1>QA Tester Dashboard</h1>
    <p>Welcome, {{ request.user.username }}</p>
    <p>Check and manage testing tasks here.</p>
    <a href="{% url 'logout' %}">Logout</a>
</body>
</html>
EOF

echo "✅ All dashboard templates created in $TEMPLATES_DIR"
