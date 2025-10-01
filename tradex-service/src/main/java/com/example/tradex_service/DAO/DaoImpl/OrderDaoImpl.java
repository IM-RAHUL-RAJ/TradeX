package com.example.tradex_service.DAO.DaoImpl;

import com.example.tradex_service.DAO.OrderDao;
import com.example.tradex_service.Mapper.OrderMapper;
import com.example.tradex_service.Models.Order;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderDaoImpl implements OrderDao {

    private final OrderMapper orderMapper;

    public OrderDaoImpl(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Override
    public int insertOrder(Order order) {
        return orderMapper.insert(order);
    }

    @Override
    public Order findById(String orderId) {
        return orderMapper.findById(orderId);
    }

    @Override
    public List<Order> findByClient(String clientId) {
        return orderMapper.findByClient(clientId);
    }
}
