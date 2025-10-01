//package com.example.tradex_service.DAO;
//
//
//
//import static org.junit.jupiter.api.Assertions.*;
//
//import com.example.tradex_service.Models.Direction;
//import com.example.tradex_service.Models.Order;  // Adjust import for your Order enum/class
//import com.example.tradex_service.Models.Trade;
//import org.junit.jupiter.api.Test;
//
//import java.lang.reflect.Constructor;
//
//public class TradeTest {
//
//    @Test
//    void createTradeUsingSetters() {
//        Trade trade = new Trade(); // assuming default constructor exists and accessible
//
//        trade.setClientId("client123");
//        trade.setQuantity(100.0);
//        trade.setPrice(50.0);
//        trade.setDirection(Direction.BUY);
//        trade.setInstrumentId("AAPL");
//        trade.setOrder(Order.MARKET); // Adjust if your Order enum differs
//        // Set other fields as needed
//
//        assertEquals("client123", trade.getClientId());
//        assertEquals(100.0, trade.getQuantity());
//        assertEquals(50.0, trade.getPrice());
//        assertEquals(Direction.BUY, trade.getDirection());
//        assertEquals("AAPL", trade.getInstrumentId());
//        assertEquals(Order.MARKET, trade.getOrder());
//        // Additional asserts as needed
//    }
//
//    @Test
//    void createTradeUsingReflection() throws Exception {
//        Constructor<Trade> constructor = Trade.class.getDeclaredConstructor(
//                String.class, double.class, double.class, Direction.class, String.class, Order.class, String.class /* add other param types as needed */
//        );
//        constructor.setAccessible(true);
//
//        Trade trade = constructor.newInstance(
//                "client123", 100.0, 50.0, Direction.BUY, "AAPL", Order.MARKET, "extraField" /* pass actual args */
//        );
//
//        assertEquals("client123", trade.getClientId());
//        assertEquals(100.0, trade.getQuantity());
//        assertEquals(50.0, trade.getPrice());
//        assertEquals(Direction.BUY, trade.getDirection());
//        assertEquals("AAPL", trade.getInstrumentId());
//        assertEquals(Order.MARKET, trade.getOrder());
//    }
//}
