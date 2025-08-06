module com.example.desktop_app {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.desktop_app to javafx.fxml;
    exports com.example.desktop_app;
}