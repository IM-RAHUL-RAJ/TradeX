package com.example.tradex_service.DAO;

import com.example.tradex_service.Models.Order;
import java.util.List;

public interface OrderDao {
    int insertOrder(Order order);
    Order findById(String orderId);
    List<Order> findByClient(String clientId);
//    int updateStatus(String orderId, String status);
}
